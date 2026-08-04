from flask import Blueprint
from controllers.stats_controller import StatsController

stats_bp = Blueprint("stats", __name__, url_prefix="/api")

stats_bp.route("/stats", methods=["GET"])(StatsController.get_stats)
